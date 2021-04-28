# Another Medium Github ReadMe API
![Version 1.0.0](https://img.shields.io/badge/version-1.0.0-blue) ![Licence](https://img.shields.io/badge/Licence-MIT-green)

I really liked the other versions of the Medium API's for Github, but they were a little short on customization side. I decided to create my own API to give users more customization options.

![API](https://another-medium-github-readme.vercel.app/api/medium?index=0&username=yagiziskirik)

## Usage

You can use this API like this:

```
![API](https://another-medium-github-readme.vercel.app/api/medium?index=INDEXOFARTICLE&username=YOURUSERNAME)
```

As I mentioned before, you can customize it to your liking. To do that, you can use the following queries:
* username: Your username in Medium.com.
* index: Index of the article.
* descLength: How many characters should be shown in the description section.
* borderRadius: Radius of the border in HEX.
* borderColor: Color of the border in HEX.
* titleColor: Color of the article in HEX.
* authorColor: Color of the author in HEX.
* descColor: Color of the description in HEX.
* bgColor: Color of the background in HEX.
* dateColor: Color of the date in HEX.
* highlightColor: Color of the highlight in HEX.

This is the combination of the all:
```
![API](https://another-medium-github-readme.vercel.app/api/medium?index=0&username=yagiziskirik&descLength=40&titleColor=c09839&authorColor=c09839&descColor=ebebeb&bgColor=151515&dateColor=999999&highlightColor=2e2e2e&borderRadius=10&borderColor=ffffff)
```
