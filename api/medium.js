const request = require("request");
import moment from "moment";
const axios = require("axios");

function createImage(
  title,
  pubDate,
  link,
  author,
  base64ImageLink,
  description,
  descLength,
  titleColor,
  authorColor,
  descColor,
  bgColor,
  dateColor,
  highlightConvertedColor,
  borderRadius,
  borderColor,
  generalWidth,
) {
  var shortDescription =
    description
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace("\n", " ")
      .substr(0, descLength) + "...";
  var momentTime = moment(pubDate).fromNow();
  var svgBase = `
  <svg fill="none" width="${generalWidth}" height="135" xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <style>
          *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: sans-serif
          }
          @keyframes gradientBackground {
            0% {
              background-position-x: 0%;
            }
            100% {
              background-position-x: 100%;
            }
          }
          .flex {
            display: flex;
            align-items:center;
          }
          .outer-container{
            height:135px;
          }
          .container{
            height: 133px;
            border: 1px solid #${borderColor};
            padding: 10px 20px;
            border-radius: ${borderRadius}px;
            background: #${bgColor};
            background: linear-gradient(60deg, #${bgColor} 0%, #${bgColor} 47%, ${highlightConvertedColor} 50%, #${bgColor} 53%, #${bgColor} 100%);
            background-size: 600% 400%;
            animation: gradientBackground 3s ease infinite;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          img {
            margin-right: 10px;
            width: 150px;
            height: 100%;
            object-fit: cover;
          }
          .right{
            flex: 1;
          }
          a{
            text-decoration: none;
            color: inherit;
          }
          p {
            line-height: 1.5;
            color: #${descColor};
          }
          h3{
            color: #${titleColor};
          }
          small{
            color: #${dateColor};
            display: block;
            margin-top: 5px;
            margin-bottom: 8px;
          }
          h6{
              color: #${authorColor};
              display: block;
              margin-top: 5px;
            }
          
        </style>
        <div class="outer-container flex">
          <a class="container flex" href="${link}" target="__blank">
            ${base64ImageLink && `<img style="border-radius: 7px;" src="data:image/png;base64,${base64ImageLink}"/>`}
            <div class="right">
              <h3>${title}</h3>
              <small>${momentTime}</small>
              <p>${shortDescription}</p>
              <h6>by ${author}</h6>
            </div>
          </a>
        </div>
      </div>
    </foreignObject>
  </svg>`;
  return svgBase;
}

function hexToRGBA(hex, alpha) {
  hex = ("" + hex).trim().replace(/#/g, ""); //trim and remove any leading # if there (supports number values as well)
  if (!/^(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) throw "not a valid hex string"; //Regex Validator
  if (hex.length == 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  } //support short form
  var b_int = parseInt(hex, 16);
  return (
    "rgba(" +
    [
      (b_int >> 16) & 255, //R
      (b_int >> 8) & 255, //G
      b_int & 255, //B
      alpha || 1, //add alpha if is set
    ].join(",") +
    ")"
  );
}

module.exports = (req, res) => {
  const username = req.query.username || "medium";
  const index = req.query.index || "0";
  const descLength = req.query.descLength || "40";
  const borderRadius = req.query.borderRadius || "10";
  const borderColor = req.query.borderColor || "ffffff";
  const titleColor = req.query.highlightColor || "c09839";
  const authorColor = req.query.authorColor || "c09839";
  const descColor = req.query.authorColor || "ebebeb";
  const bgColor = req.query.bgColor || "151515";
  const dateColor = req.query.dateColor || "999999";
  const highlightColor = req.query.highlightColor || "2e2e2e";
  const generalWidth = req.query.generalWidth || "800";
  const highlightConvertedColor = hexToRGBA(highlightColor);
  request(
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@" +
      username,
    { json: true },
    async (err, resp, body) => {
      if (err) {
        return console.log(err);
      }
      var title = body.items[index].title;
      var pubDate = body.items[index].pubDate;
      var link = body.items[index].link;
      var author = body.items[index].author;
      // var thumbnail = body.items[index].thumbnail;
      var image = body.items[index].image;
      var description = body.items[index].description;
      console.log(`Got the thumbnail: ${image}`);
      let base64Img;
      if (image || image !== "") {
        const { data: imageRaw } = await axios.get(image, {
          responseType: "arraybuffer",
        });
        console.log(`Received raw: ${imageRaw}`);
        base64Img = Buffer.from(imageRaw).toString("base64");
      }
      var svgImage = createImage(
        title,
        pubDate,
        link,
        author,
        base64Img,
        description,
        descLength,
        titleColor,
        authorColor,
        descColor,
        bgColor,
        dateColor,
        highlightConvertedColor,
        borderRadius,
        borderColor,
        generalWidth,
      );
      res.setHeader("Content-Type", "image/svg+xml");
      res.status(200).send(svgImage);
    },
  );
};
