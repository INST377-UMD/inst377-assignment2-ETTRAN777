const commands = {
    'hello': () => alert('Hello'),
    'change the color to :color': (color) => {
        if(color === 'default'){
            document.body.style.backgroundColor = '#fddfbd';
        }
        document.body.style.backgroundColor = color;
    },
    'navigate to :page': (page) => {
        if(page.toLowerCase() === 'home'){
            page = 'index';
        }
        window.location.href = `${page.toLowerCase()}.html`;
    }
};

function listening(isListening){
    if(isListening){
        document.getElementById("start").style.border = "3px solid #1493f1";
        document.getElementById("stop").style.border = "1px solid black";
        annyang.addCommands(commands);
        annyang.start();
    }else{
        document.getElementById("start").style.border = "1px solid black";
        document.getElementById("stop").style.border = "3px solid #1493f1";
        annyang.abort();
    }
}
