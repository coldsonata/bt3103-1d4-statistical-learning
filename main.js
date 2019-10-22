Vue.component("waifu", {
  template: `
  <div class="waifu" :style="{'background-image':'url('+imageUrl+')'}">
    <div class="cover"></div>
  </div>
  `,
  methods : {
    initialize : async function(e) {
      let result = await new Promise(resolve => {
        const nekoUrl = "https://www.nekos.life/api/v2/img/neko";
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            resolve(xmlHttp.responseText);
        }
        xmlHttp.open("GET", nekoUrl, true); 
        xmlHttp.send(null);
      });
      this.imageUrl = JSON.parse(result).url;
    }
  },
  data() {
    return {
      imageUrl : "",
    }
  },
  created() {
    this.initialize();
  }
});

let fuee = new Vue({
  el: "#app",
  methods: {
  }
});