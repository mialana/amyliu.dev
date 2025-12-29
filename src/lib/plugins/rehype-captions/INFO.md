# Rehype Captions

Credits to [rehype-image-caption](https://github.com/Robot-Inventor/rehype-image-caption/tree/main)
for code inspiration.

Decided to create a local plugin that solves essentially the same task but tweaked to achieve my personal preferences.

Namely:
- adding classes to the newly created figcaption and the enclosing figure.
- Adding support for multi-line captions.
- Adding support for svgs and inline-svgs. See my other rehype plugin `rehype-svg` for more context. This allows me to place them in whichever order of execution rather than one depending on the other (I am forgetful).

## Example

Input:
```markdown

<!-- Image with single-line caption -->
![alt text](image.jpg)
*caption text*

<!-- Image with multi-line caption -->
![alt text](image.jpg)
*caption text 1*
*caption text 2*
*caption text 3*

<!-- Image without caption (spoiler: it is not impacted) -->
![alt text](image.jpg)
```

Output:
```html
<!-- `img` HTML element with single-line caption -->
<figure class="{desired-figure-caption-class-name}">
    <img src="image.jpg" alt="alt text">
    <figcaption class="{desired-caption-class-name}">
		<p>
			caption text
		</p>
	</figcaption>
</figure>

<!-- Image with multi-line caption -->
<figure class="{desired-figure-caption-class-name}">
    <img src="image.jpg" alt="alt text">
    <figcaption class="{desired-caption-class-name}">
		<p>
			caption text 1
		</p>
		<p>
			caption text 2
		</p>
		<p>
			caption text 3
		</p>
	</figcaption>
</figure>

<!-- Image without caption -->
<img src="image.jpg" alt="alt text">

```