"use strict";
import { postLoad } from './postload.js';
import { preLoad } from './preload.js';

window.route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const handleLocation = async () => {
  preLoad();
  const path = (window.location.pathname == "/") ? "/index/" : window.location.pathname;
  const route = "/pages" + path.slice(0, -1) + ".html" || "/pages/404.html";
  const html = await fetch(route).then((data) => data.text());
  const htmlparse = new DOMParser().parseFromString(html,"text/html");
  document.getElementById("main-page").innerHTML = ""
  htmlparse.querySelectorAll("link[rel='stylesheet']").forEach((link) => {
    document.getElementById("main-page").innerHTML += new XMLSerializer().serializeToString(link);
  });
  document.getElementById("main-page").innerHTML += new XMLSerializer().serializeToString(htmlparse.body);
  (function(htmlparse,document){
    const dq = document.querySelector.bind(document);
    const hq = htmlparse.querySelector.bind(htmlparse);
    if (hq("title") != null) {
      document.title = htmlparse.title;
    }
    if (hq("meta[property=\"og:url\"]") != null) {
      dq("meta[property=\"og:url\"]").setAttribute("content",hq("meta[property=\"og:url\"]").getAttribute("content"));
    }
    if (hq("meta[property=\"og:type\"]") != null) {
      dq("meta[property=\"og:type\"]").setAttribute("content",hq("meta[property=\"og:type\"]").getAttribute("content"));
    }
    if (hq("meta[property=\"og:site_name\"]") != null) {
      dq("meta[property=\"og:site_name\"]").setAttribute("content",hq("meta[property=\"og:site_name\"]").getAttribute("content"));
    }
    if (hq("meta[property=\"og:title\"]") != null) {
      dq("meta[property=\"og:title\"]").setAttribute("content",hq("meta[property=\"og:title\"]").getAttribute("content"));
    }
 })(htmlparse,document);
  postLoad();
};

window.addEventListener("popstate", (event) => {
  handleLocation();
});

handleLocation();