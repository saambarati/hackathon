var $ = $
$(document).ready(onReady)
function onReady() {
  console.log('loaded getSinglyData')
  var form = $('#main-form')
    , serviceName = $('#form-service')
    , serviceEndpoint = $('#form-endpoint')
    , results = $('<div/>').attr('id', 'results')
  form.after(results)

  form.submit(function (e) {
    e.preventDefault()

    var service = serviceName.val()
      , endpoint = serviceEndpoint.val()
      , url = 'http://localhost:8081/' + service
      , sel = $('#form-data-selector').val()
    if (endpoint) url += '/' + endpoint

    console.log(service + '  ' + endpoint)
    console.log(url)

    $.getJSON(url, handleJson)
    function handleJson(data) {
      var innerHtml = '<ul>'
      data.forEach(function(d) {
        var item
        if (sel) item = d.data[sel]
        else item = JSON.stringify(d)
        innerHtml += '<li>' + item + '</li>'
      })
      if (!data.length) innerHtml += '<li>data has no length</li>'
      innerHtml += '</ul>'

      results.html(innerHtml)
    }

  })
}

