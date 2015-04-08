var data = '';
req
  .on('data', function(chunk) {
    data += chunk;
  })
  .on('end', function() {
    console.log('POST data: %s', data);
  })