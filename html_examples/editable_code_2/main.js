let fuee = new Vue({
  el : "#app",
  data : {
    codeblockNames : ["editor", "editor2"]
  },
  methods : {
    execute(id) {
      let lines = $("#" + id).next().find(".codemirror-line");
      let output = ""
      for (let i = 0; i < lines.length; i++) {
        let line = lines.eq(i).text();
        output += line + '\n';
      }
      console.log(JSON.stringify(output));
    }
  },
  mounted() {
    for (let name of this.codeblockNames) {
      CodeMirror.fromTextArea(document.getElementById(name), {
        lineNumbers: true,
        mode: "python",
        theme: "night",
        indentUnit: 4
      });
    }
  }
});