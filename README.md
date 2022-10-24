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
### Download a free PDF

 <i>If you have already purchased a print or Kindle version of this book, you can get a DRM-free PDF version at no cost.<br>Simply click on the link to claim your free PDF.</i>
<p align="center"> <a href="https://packt.link/free-ebook/9781786465290">https://packt.link/free-ebook/9781786465290 </a> </p>