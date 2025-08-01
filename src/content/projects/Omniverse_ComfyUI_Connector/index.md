---
title: NVIDIA Omniverse ComfyUI Connector
slug: Omniverse_ComfyUI_Connector
startDate: 2024-10-17
endDate: 2024-12-28
type: individual
category: internship
demoVideoLink: https://youtu.be/eDHMRtDUeCI
techStack:
    - NVIDIA_Omniverse_Kit
    - ComfyUI
    - Python
    - PyTorch
    - NumPy
tags:
    - "2024"
    - plugin
    - image_processing
    - artificial_intelligence
description: A plugin for the NVIDIA Omniverse platform to support a ComfyUI workflow directly within the viewport.
code: https://github.com/livingbio/Omniverse-ComfyUI-bridge-template
externalLinks:
    - https://developer.nvidia.com/blog/accelerating-video-production-and-customization-with-gliacloud-and-nvidia-omniverse-libraries/
---

## Summary

This project introduces a plugin that integrates the ComfyUI interface into the NVIDIA Omniverse Kit environment. Designed as part of an internship with [GliaCloud Inc., Ltd.](https://www.gliacloud.com/en/), the connector enables real-time communication between the Omniverse 3D viewport and ComfyUI node graphs. Combining the power of modern GenAI diffusion models with Omniverse's interactive rendering engine, the tool streamlines commercial content creation for AI-assisted 2D-to-3D workflows.

## Motivation

Generative AI tools like ComfyUI are increasingly used in image and video workflows, but they lack direct access to 3D scene data and render output. This project introduces a connector between ComfyUI and applications built on Omniverse Kit, enabling real-time access to viewport data from scenes with a USD hierarchy and timeline. Treating the Kit environment as a render backend and exposing its output as structured PyTorch tensors, the system supports multi-frame conditioning, iterative design, and AI-assisted content generation while maintaining status as a standalone, streamlined service.

## Achievements

1. Built a Omniverse Kit extension, `omni.comfyui.connector.core` that exposes a service endpoint for local ComfyUI instances.
2. Created custom ComfyUI node templates, `OmniViewportFrameNode` and `OmniViewportRecordingNode` to trigger timeline playback and capture viewport frames as AOV data (depth, normals, instance IDs, semantic segmentation, etc.)
3. Streamed per-frame data as NumPy arrays and PyTorch tensors through the ComfyUI API.
4. Supported integration with existing ComfyUI workflows such as Flux and other diffusion models. Created a ComfyUI workflow template for example usage.
5. Ensured compatibility with any Omniverse Kit-based application featuring a USD stage and time-framed scene.

## Next Steps

- [ ] Support arbitrary frame range selection instead of fixed frame count
- [ ] Add controls for selecting specific AOVs or render passes to capture

## Method

**Note:** The root directory for all referenced files is\_  
`exts/omni.comfyui.connector.core-0.1.0/omni/comfyui/connector/core`.

### API Routing and Viewport Services

The extension’s service layer is structured around two FastAPI routers—`viewport_capture` and `viewport_record`. These are mounted during startup and handle the core HTTP endpoints used by ComfyUI.

In `services/viewport_capture.py`, the `/viewport-capture/simple-capture` route is implemented as a synchronous RGB frame request. It uses utilities from `ext_utils.py` to define file storage paths and offloads the actual image capture to Kit’s legacy viewport API. The rendered image is saved to disk and returned via a relative URL, which the ComfyUI node then fetches.

```python
# exts/omni.comfyui.connector.core-0.1.0/omni/comfyui/connector/core/services/viewport_capture.py

# Using the `@router` annotation, we'll tag our `capture` function handler to document the responses and path of the
# API, once again using the OpenAPI specification format.
@router.get(
    path="/simple-capture",
    summary="Capture a given USD stage",
    description="Capture a given USD stage as an image.",
    response_model=ViewportCaptureResponseModel,
    tags=["Viewport"],
    responses={200: {"model": ViewportCaptureResponseModel}, 400: {"model": ViewportCaptureResponseModel}},
)
async def simple_capture(response: Response) -> ViewportCaptureResponseModel:
```

The `/viewport-record` endpoint in `services/viewport_record.py` serves as a thin wrapper that forwards validated capture requests to the `run()` function defined in `use_replicator.py`. In `viewport_models.py`, the request and response formats, `ViewportRecordRequestModel` and `ViewportRecordResponseModel`, are strongly typed and inherit from `pydantic.BaseModel` class, which define user-configurable fields such as number of frames and renderer types (realtime or path-traced).

```python
# exts/omni.comfyui.connector.core-0.1.0/omni/comfyui/connector/core/models/viewport_models.py

class ViewportRecordRequestModel(BaseModel):
    """Model describing the request to record a viewport."""

    num_frames_to_record: int = Field(
        default=100,
        title="Capture Status",
        description="Status of the recording of the given USD stage.",
    )
    renderer: str = Field(
        default="realtime",
        title="Viewport Renderer",
        description="Renderer used to record viewport",
    )

```

All processing happens asynchronously, and the response is returned as an in-memory JSON object containing the stacked results. This design keeps `viewport_record.py` minimal and service-oriented, relying on internal modules to handle the rendering and data pipeline.

### Omni Replicator Usage

Multi-frame capture requests are executed through the `run()` function in `use_replicator.py`. This function serves as the core execution path for `/viewport-record`, handling per-frame rendering and buffer extraction. It uses [`omni.replicator.core`](https://docs.omniverse.nvidia.com/py/replicator/1.11.35/index.html) to set the renderer backend (`RTX - Real-Time` or `Path Traced`) and configure the output pipeline.

During each frame step, the viewport is captured using `omni.kit.viewport.utility.get_active_viewport`, and selected AOV buffers (e.g. `"rgb"`, `"depthLinear"`, `"normals"`, `"semanticSegmentation"`, `"instanceSegmentation"`) are registered through replicator's `Annotator` API. Data from these annotators is retrieved using `.get_data()` calls and stored in memory.

For semantic data, `_add_auto_semantics()` generates class labels for USD prims and applies them using `add_prim_semantics()` from the `semantics.schema.editor` module. This ensures the stage includes class-based annotation before AOV collection begins.

```python
# exts/omni.comfyui.connector.core-0.1.0/omni/comfyui/connector/core/use_replicator.py
async def _add_auto_semantics():
    _output_str = ""

    _prim_types_filter = "Mesh, Material, Skeleton"
    _prefixes_to_remove = "SM, MI, Mat"
    _suffixes_to_remove = "Mat, 6M"

    prim_types = [prim_type for prim_type in _prim_types_filter.replace(" ", "").split(",") if prim_type]
    prefixes = [prefix for prefix in _prefixes_to_remove.replace(" ", "").split(",") if prefix]
    suffixes = [suffix for suffix in _suffixes_to_remove.replace(" ", "").split(",") if suffix]

    get_prim_data = partial(
        get_prim_auto_label,
        prim_types=prim_types,
        remove_numerical_ending=True,
        prefixes=prefixes,
        suffixes=suffixes,
        apply_cumulatively=True,
        remove_separators=True,
    )
    add_prim_data = partial(
        add_prim_semantics, type="class", write_type=LabelWriteType.NEW, preview=False
    )

    context: UsdContext = omni.usd.get_context()
    for prim in context.get_stage().Traverse():
        label = get_prim_data(prim)
        if label:
            _output_str += add_prim_data(prim, data=label)
```

All captured arrays are packed into a response model and returned directly to the service layer, where they are streamed back to ComfyUI as serialized JSON.

### Viewport Screenshot Service Logic

The `async capture_viewport()` function in `ext_utils.py` invokes Omniverse Kit’s built-in screenshot mechanism. It validates the existence of a loaded USD stage and an active, rendering viewport, then calls `viewport.wait_for_rendered_frames()` to ensure the capture occurs only after the current frame is fully resolved. The screenshot is captured using `capture_viewport_to_file()`, a utility provided by `omni.kit.viewport.utility`, which asynchronously writes the image to a temporary extension-specific path. Once saved, the file is moved to a static directory mounted by the Kit web server, allowing it to be retrieved via HTTP by external clients like ComfyUI. The function returns a success flag, the relative web path to the image, and a debug message. This approach ensures robust, render-synchronized single-frame capture with graceful handling of missing or inactive viewports.

### Custom ComfyUI Nodes and Workflow Template

The integration includes two custom ComfyUI nodes: `OmniViewportFrameNode` and `OmniViewportRecordingNode`. Both are implemented in `omni_nodes.py` and enable real-time data transfer from an Omniverse viewport into a ComfyUI graph.

`OmniViewportFrameNode` performs a one-shot image capture from the currently active viewport. It sends a GET request to the `/viewport-capture/simple-capture` endpoint on the local connector service. The response includes a relative path to a temporary image, which the node fetches using `PIL` and converts into a normalized PyTorch tensor. This tensor is returned as an `"IMAGE"`-type output, compatible with downstream nodes in ComfyUI.

`OmniViewportRecordingNode` supports multi-frame capture. Upon execution, it sends a JSON payload to the `/viewport-capture/record` endpoint, then asynchronously receives and parses a multi-frame tensor stack from the response. Each frame is wrapped as a separate `"IMAGE"` output, enabling time-aware workflows such as video synthesis and temporal conditioning.

![gif](assets/omni_record_process.gif)

In addition to capture, `omni_nodes.py` includes post-processing utilities for interpreting AOV data. Functions such as `_colorize_normals`, `_colorize_depth`, and `_colorize_standard` handle normalization and tensor conversion of non-RGB outputs. Depth data is remapped using a log-scale transform to enhance perceptual contrast, while normals are adjusted from `[-1, 1]` to `[0, 1]` and rescaled. These processed tensors are structured to match ComfyUI’s `"IMAGE"` format, enabling seamless input into any image-based diffusion model.

```python
# exts/omni.comfyui.connector.core-0.1.0/omni/comfyui/connector/core/omni_nodes.py
def _colorize_normals(data: list):
    start = round(perf_counter(), 2)

    normals_data = data[0]

    normals_data = ((normals_data * 0.5 + 0.5) * 255).astype(np.uint8)
    normals_data = normals_data / 255.0
    normals_data = torch.from_numpy(normals_data)

    data[0] = normals_data

    end = round(perf_counter(), 2)
```

`OmniViewportRecordingNode` supports configuration of both frame count and renderer mode (`RTX - Real-Time` or `Path Tracing`) via UI-selectable parameters. It returns five outputs: `rgb_out`, `depth_out`, `normals_out`, `instance_id_out`, and `semantic_out`. These are individually routed to downstream nodes, allowing selective use or combination depending on the synthesis pipeline. The node implementation ensures type safety, normalized data scaling, and alignment with the frame-by-frame order in the capture buffer.

![gif](assets/omni_record_output_aovs.gif)

The repository includes a ready-to-use workflow file (`omni_workflow.json`) that demonstrates how to incorporate these nodes into a standard ComfyUI pipeline.
