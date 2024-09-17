
let liftAvailable = []
let liftsCordinates = []
let hasLiftBeenCalled = [];
let waitingForLift = [];
let lifts = 0;
let floors = 0;

function loadApp(){

    lifts = document.getElementById('liftsInput').value
    floors = document.getElementById('floorsInput').value

    if(lifts === "" || floors ===""){
        alert("Plesae input numerical Values");
        return;
    }

    lifts = Number(lifts);
    floors = Number(floors);
    

    if(!Number.isInteger(floors) || !Number.isInteger(lifts)){
        alert("Please input integer values only (for eg : 5)")
        return;
    }

    if(lifts < 1 ){
        alert("Please input Lift value greater than 0")
        return;
    }

    if(floors < 2){
        alert("Please input Floors value greater than 1")
        return;
    }

    document.body.innerHTML = "";
    loadFloors(lifts,floors)
    loadLifts(lifts,floors)
}

function loadFloors(lifts,floors){
    const floorSpace = document.createElement('section')
    floorSpace.classList.add('floorSpace');

    const reloadArea = createReloadArea()

    document.body.appendChild(floorSpace)
    document.body.appendChild(reloadArea);
    
    for(let i = 1 ; i <= floors ;i++){

        const floor = document.createElement("div");

        //adding floorNumber to the floor
        const floorNumber = document.createElement("div")
        floorNumber.classList.add('floorNumber')
        floorNumber.innerHTML = "Floor " + (floors - i + 1)
        floor.style.minWidth = (250 + (lifts)*150) + 'px'; 

        floor.appendChild(floorNumber)

        //adding up button to the floor
        const up = document.createElement("button")
        up.classList.add('btn','lift-btn');
        up.id = `${floors - i + 1}`
        up.setAttribute('direction' , '1');
        up.innerHTML = 'UP'
        up.addEventListener('click' , function(){callToLift(this)});
        if(i!= 1) floor.appendChild(up)
        

        //adding down button to the floor
        const down = document.createElement("button")
        down.classList.add('btn','lift-btn');
        down.id = `${floors - i + 1}`
        down.setAttribute('direction' , '0');
        down.innerHTML = 'DOWN'
        down.addEventListener('click',function(){callToLift(this)});
        if(i!= floors)floor.appendChild(down)
        
        //adding floor to the floorSpace
        floor.classList.add('floor');
        floorSpace.appendChild(floor);

        hasLiftBeenCalled.push([0,0]);
    }
}

function loadLifts(lifts,floors){
    for(var i = 1 ;i <=lifts ;i++){ 

        const lift = document.createElement('div');
        lift.className = 'lift';
        lift.id = 'lift' + i;
        lift.style.left = (250 + (i-1)*150) + "px";  
        lift.style.top = ((floors-1)*150 + 20) + "px";
 
        const leftDoor = document.createElement('div');
        leftDoor.classList.add('liftDoor' , 'leftDoor');
        lift.appendChild(leftDoor);

        const rightDoor = document.createElement('div');
        rightDoor.classList.add('liftDoor','rightDoor');
        lift.appendChild(rightDoor);

        document.body.appendChild(lift);

        liftsCordinates.push(1);
        liftAvailable.push(true);
    }   
}

async function callToLift(button){

    const id = button.id;
    const dir = Number(button.getAttribute('direction'));

    if(hasLiftBeenCalled[id-1][dir] === 1) return;
    hasLiftBeenCalled[id-1][dir] = 1;
    button.style.backgroundColor = 'red';

    let liftID = findNearestLiftID(id,dir);

    if(liftID === 0){
       
        waitingForLift.push(button);
        return;
    }

    await moveLift(liftID , button);

    while(waitingForLift.length != 0) await moveLiftforWaitingFlors(liftID);
    liftAvailable[liftID-1] = true;
}

async function moveLiftforWaitingFlors(liftID){
    const button = waitingForLift.shift();
    await moveLift(liftID,button);
}

async function moveLift(liftID,button){

    const id = button.id;
    const dir = Number(button.getAttribute('direction'));

    const timeToMove = getTimeOfLift(liftID,button);

    const lift = document.getElementById(`lift${liftID}`);

    //moving the lift to new Floor
    lift.style.transition = `top ${timeToMove}s linear`
    liftAvailable[liftID-1] = false;
    
    lift.style.top = ((floors-button.id)*150 + 20) + "px";

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
    await new Promise(resolve => setTimeout(resolve,(2600)));

    //updating states
    liftsCordinates[liftID-1] = button.id;
    hasLiftBeenCalled[id-1][dir] = 0;
    button.style.backgroundColor = '#24a0ed';
}

function getTimeOfLift(liftID,button){
    const currentFloor = liftsCordinates[liftID-1];
    const timeToMove = Math.abs(currentFloor - button.id)*2;
    return timeToMove
}

function findNearestLiftID(id,dir){

    let min = 1e9;
    let nearestLiftID = 0;
    for(let i = 1 ;i <= liftsCordinates.length ;i++){
        if(!liftAvailable[i-1]) continue;
        let d = Math.abs(id - liftsCordinates[i-1]);
        if(d < min){
            nearestLiftID = i;
            min = Math.abs(id - liftsCordinates[i-1]);
        }
    } 
    return nearestLiftID;
}

function createReloadArea(){
    const reloadArea = document.createElement('section');
    reloadArea.classList.add('reload');

    const reloadBtn = document.createElement('button');
    reloadBtn.classList.add('reloadBtn');
    reloadBtn.innerHTML = 'Reload Lift Simulation'

    reloadBtn.addEventListener('click' , (e)=>{
        callReloadBtn(e);
    })

    reloadArea.appendChild(reloadBtn);

    return reloadArea;
}

function callReloadBtn(e){
    const userConfirmed = confirm("Are you Sure you want to Reload the Lift Simulation");
    if(userConfirmed){
        window.location.reload();
    }
}



