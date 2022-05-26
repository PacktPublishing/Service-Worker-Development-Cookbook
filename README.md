## [Get this title for $10 on Packt's Spring Sale](https://www.packt.com/B05381?utm_source=github&utm_medium=packt-github-repo&utm_campaign=spring_10_dollar_2022)
-----
For a limited period, all eBooks and Videos are only $10. All the practical content you need \- by developers, for developers

# Service Worker Development Cookbook

[Service Worker Development Cookbook] (https://www.packtpub.com/application-development/service-worker-development-cookbook?utm_source=github&utm_medium=respository&utm_campaign=9781786465290) enables you to build highly available and performant native web applications that seamlessly integrate with third-party APIs. Web developers, mobile application developers, and software engineers with any level of knowledge can use this book. You should be familiar with JavaScript and HTML.

##Instructions and Navigation

This is the code repository for [Service Worker Development Cookbook](https://www.packtpub.com/application-development/service-worker-development-cookbook?utm_source=github&utm_medium=respository&utm_campaign=9781786465290), published by Packt Publishing. It contains all the supporting project files necessary to work through the book from start to finish. You will see code something similler to the following:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Basic Registration</title>
</head>
<body>
  <p>Registration status: <strong id="status"></strong></p>

  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(
        'service-worker.js',
        { scope: './' }
      ).then( function(serviceWorker) {
        document.getElementById('status').innerHTML = 'successful';
```
