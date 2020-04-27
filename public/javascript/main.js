const followB = document.getElementById('follow')


var toggle = false

function follow(){

    if(!toggle){
        toggle = true
        followB.style.backgroundColor = '#7de87d'
        return
    }
    else{
        toggle = false
        followB.style.backgroundColor = 'blue'
        return
    }

    

}