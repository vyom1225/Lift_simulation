liftQueue = []
function loadApp(){
    var lifts = document.getElementById('liftsInput').value
    var floors = document.getElementById('floorsInput').value
    
    console.log(lifts);
    if( isNaN(lifts)|| isNaN(floors)){
        alert("Please input numerical values only")
        return;
    }
    
    document.body.innerHTML = "";
    loadFloors(lifts,floors)
    loadLifts(lifts,floors)
}

function loadFloors(lifts,floors){
    var floorSpace = document.createElement('section')
    floorSpace.classList.add('floorSpace');

    document.body.appendChild(floorSpace)
    for(var i = 1 ; i <= floors ;i++){

        var floor = document.createElement("div");

        //adding floorNumber to the floor
        var floorNumber = document.createElement("div")
        floorNumber.classList.add('floorNumber')
        floorNumber.innerHTML = "Floor " + (floors - i + 1)
        floor.style.minWidth = (250 + (lifts)*150) + 'px'; 

        floor.appendChild(floorNumber)

        //adding up button to the floor
        var up = document.createElement("button")
        up.classList.add('btn','lift-btn');
        up.id = `${i}`
        up.innerHTML = 'UP'
        up.addEventListener('click' , function(){callLift(this)});
        if(i!= 1) floor.appendChild(up)
        

        //adding down button to the floor
        var down = document.createElement("button")
        down.classList.add('btn','lift-btn');
        down.id = `${i}`
        down.innerHTML = 'DOWN'
        down.addEventListener('click',function(){callLift(this)});
        if(i!= floors)floor.appendChild(down)
        
        //adding floor to the floorSpace
        floor.classList.add('floor');
        floorSpace.appendChild(floor);
    }
}

function loadLifts(lifts,floors){
    for(var i = 1 ;i <=lifts ;i++){ 

        var lift = document.createElement('div');
        lift.className = 'lift';
        lift.id = 'lift' + i;
        lift.style.left = (250 + (i-1)*150) + "px";  
        lift.style.top = ((floors-1)*150 + 20) + "px";
 
        var leftDoor = document.createElement('div');
        leftDoor.classList.add('liftDoor' , 'leftDoor');
        lift.appendChild(leftDoor);

        var rightDoor = document.createElement('div');
        rightDoor.classList.add('liftDoor','rightDoor');
        lift.appendChild(rightDoor);

        document.body.appendChild(lift);
        liftQueue.push(i);
    }   
}

async function callLift(button){

    //ID of the floor Button where the lifts needs to go
    var id = button.id;

    //Waiting for a lift to be free
    if(liftQueue.length === 0) await waitForLift();

     //ID of a freelift that can come to this floor
    var liftID = liftQueue[0];
    liftQueue.shift();

    //pushing the lift back into the Queue once it have reached its floor
    var lift = document.getElementById(`lift${liftID}`);
    var timeToMove = getTimeOfLift(lift,button);

    //moving the lift to new Floor
    lift.style.transition = `top ${timeToMove}s linear`
    lift.style.top = ((button.id-1)*150 + 20) + "px";
    await new Promise(resolve => setTimeout(resolve,(timeToMove)*1000));

    //opening the doors
    const leftDoor = lift.querySelector('.leftDoor');
    const rightDoor = lift.querySelector('.rightDoor');
    leftDoor.style.width = '0px';
    rightDoor.style.width = '0px';
    await new Promise(resolve => setTimeout(resolve,(3000)));

    //closing the doors
    leftDoor.style.width = '55px';
    rightDoor.style.width = '55px';
    await new Promise(resolve => setTimeout(resolve,(2500)));
    liftQueue.push(liftID);
}

async function waitForLift(){
    while(liftQueue.length === 0){
        await new Promise(resolve => setTimeout(resolve,1000));
    }
}

function getTimeOfLift(lift,button){
    var topOfLift = getComputedStyle(lift).top;
    var topOfLiftInNumbers = Number(topOfLift.slice(0,topOfLift.length-2));
    var currentFloor = Math.ceil((topOfLiftInNumbers - 20)/(150)) + 1;
    var timeToMove = Math.abs(currentFloor - button.id)*2;
    return timeToMove
}



