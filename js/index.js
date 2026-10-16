const posters = document.querySelectorAll(".poster");

let position = ["left","center","right"];

// posisi awal
posters.forEach((poster,index)=>{

    poster.classList.add(position[index]);

});

function rotatePoster(){

    // muter array
    position.unshift(position.pop());

    posters.forEach((poster,index)=>{

        poster.className = "poster";

        poster.classList.add(position[index]);

    });

}

setInterval(rotatePoster,3000);