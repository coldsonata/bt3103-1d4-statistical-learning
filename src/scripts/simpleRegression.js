const submit1b = async function() {
    let entered = $("#answer1b").text()
    $('#checking1b').slideDown(500);
    $("#incorrect1b").slideUp(500);
    $("#correct1b").slideUp(500);

    let result = await new Promise((resolve, reject) => {
        const nekoUrl = window.location.origin + "/Prod/lambda_handler"
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                resolve(xmlHttp.responseText);
            }
        }
        xmlHttp.open("POST", nekoUrl, true);
        xmlHttp.send(JSON.stringify({
            questionId: "1b",
            answer: JSON.stringify(entered)
        }));
    });
    let resultInfoTest = JSON.parse(result);
    console.log(resultInfoTest);

    let resultInfo = { correct: false };
    let expected = JSON.stringify("import statsmodels.formula.api as smf\nols = smf.ols(formula='mpg ~ acceleration', data=df)\nols_result = ols.fit()\nprint(ols_result.summary())\n");
    entered = JSON.stringify(entered);
    resultInfo.correct = (expected === entered);
    setTimeout(() => {
        if (resultInfo.correct) {
            $("#incorrect1b").slideUp(500);
            $("#correct1b").slideDown(500);
            $('#checking1b').slideUp(500);
        } else {
            $("#incorrect1b").slideDown(500);
            $("#correct1b").slideUp(500);
            $('#checking1b').slideUp(500);
        }
    }, 1000 + 3000 * Math.random());
}

let fuee = new Vue({
    el: '#app',
    data: {
        q1a: {
            correct: "Correct!",
            incorrect: "Incorrect!",
            status: "none",
            solved: false
        },
        q1b: {
            correct: "Correct!",
            incorrect: "Incorrect!",
            status: "none",
            solved: false
        },
    },
    methods: {
        submit1a() {
            let answer = $("#answer1a").val()
            if (answer === "7.82") {
                this.q1a.status = "correct";
                this.q1a.solved = true;
            } else {
                this.q1a.status = "incorrect";
            }
        },
        submit1b: async function() {
            let entered = parseCode("answer1b");
            this.q1b.status = "checking";
            let result = await new Promise((resolve, reject) => {
                const nekoUrl = window.location.origin + "/Prod/lambda_handler"
                const xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() {
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                        resolve(xmlHttp.responseText);
                    }
                }
                xmlHttp.open("POST", nekoUrl, true);
                xmlHttp.send(JSON.stringify({
                    questionId: "1b",
                    answer: JSON.stringify(entered)
                }));
            });
            let resultInfo = JSON.parse(result);
            if (resultInfo.correct) {
                this.q1b.status = "correct";
                this.q1b.solved = true;
            } else {
                this.q1b.status = "incorrect";
            }
        }
    },
    mounted() {
        initializeCodeblocks(["answer1b"]);
    }
})