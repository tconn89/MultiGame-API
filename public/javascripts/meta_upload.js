
url = 'localhost:3000/upload'
var req = request.post(url, function (err, resp, body) {
  if (err) {
    console.log('Error!');
  } else {
    console.log('URL: ' + body);
  }
});
var form = req.form();
file = 'booty.jpg'
form.append('file', fs.createReadStream(filepath));
