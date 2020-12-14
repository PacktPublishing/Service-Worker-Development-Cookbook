## $5 Tech Unlocked 2021!
[Buy and download this Book for only $5 on PacktPub.com](https://www.packtpub.com/product/service-worker-development-cookbook/9781786465290)
-----
*If you have read this book, please leave a review on [Amazon.com](https://www.amazon.com/gp/product/1786465299).     Potential readers can then use your unbiased opinion to help them make purchase decisions. Thank you. The $5 campaign         runs from __December 15th 2020__ to __January 13th 2021.__*

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
