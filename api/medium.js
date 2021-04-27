const request = require('request')
import moment from 'moment';

function createImage(title, pubDate, link, author, thumbnail, description) {
  var momentTime = moment(pubDate)
  var timeInStr = momentTime.fromNow()
  var shortDescription = description.substring(0,50) + '...'
  var svgBase = `
  <svg fill="none" width="800" height="135" xmlns="http://www.w3.org/2000/svg">
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
            border: 1px solid rgba(255,255,255,.2);
            padding: 10px 20px;
            border-radius: 10px;
            background: #151515;
            background: linear-gradient(60deg, #151515 0%, #151515 47%, rgba(46,46,46,1) 50%, #151515 53%, #151515 100%);
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
            color: inherit
          }
          p {
            line-height: 1.5;
            color: #ebebeb
          }
          h3{
            color: #c09839
          }
          small{
            color: #999999;
            display: block;
            margin-top: 5px;
            margin-bottom: 8px
          }
          h6{
              color: #c09839;
              display: block;
              margin-top: 5px;
            }
          
        </style>
        <div class="outer-container flex">
          <a class="container flex" href="${link}" target="__blank">
            <img style="border-radius: 7px;" src="${thumbnail}"/>
            <div class="right">
              <h3>${title}</h3>
              <small>${timeInStr}</small>
              <p>${shortDescription}</p>
              <h6>by ${author}</h6>
            </div>
          </a>
        </div>
      </div>
    </foreignObject>
  </svg>`
  return svgBase
}

module.exports = (req, res) => {
	const username = req.query.username || 'yagiziskirik'
  const index = req.query.index || '0'
	request('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@'+username, { json: true }, (err, resp, body) => {
    if (err) { return console.log(err) }
    var title = body.items[index].title
    var pubDate = body.items[index].pubDate
    var link = body.items[index].link
    var author = body.items[index].author
    var thumbnail = body.items[index].thumbnail
    var description = body.items[index].description
    var svgImage = createImage(title, pubDate, link, author, thumbnail, description)
		res.setHeader("Content-Type","image/svg+xml")
		res.status(200).send(svgImage)
	})
}