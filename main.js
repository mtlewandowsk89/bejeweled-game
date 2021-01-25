let clicked = 0;
let clickedNumbers = [];
let leftEdge = [9, 17, 25, 33, 41, 49];
let rightEdge = [16, 24, 32, 40, 48, 56];
let colors = ['red', 'yellow', 'blue', 'pink', 'green', 'orange', 'white'];

setTimeout(() => {
    createGrid();
}, 100);

createGrid = () => {
    let gridArea = document.getElementById('gridArea');
    for (i = 1; i <= 64; i++) {
        let circle = document.createElement('div');
        circle.className = 'circle';
        circle.id = i;
        circle.style.backgroundColor = colors[Math.floor(Math.random() * 7)];
        gridArea.append(circle);
        createClickEvent(i);
    }
    updateBoard(true);
}

createClickEvent = (i) => {
    document.getElementById(i).addEventListener('mousedown', (e) => {
        trackSelections(e);
    })
}

trackSelections = (e) => {
    if (clicked === 2) {
        clicked = 0;
        clickedNumbers = [];
    }

    if (clicked === 0) {
        document.getElementById(+e.target.id).style.border = '3px solid black';
    } else {
        document.getElementById(clickedNumbers[0]).style.border = '1px solid black';
    }

    if (clicked <= 1) {
        clickedNumbers.push(+e.target.id);
        clicked++
    }
    
    if (clickedNumbers.length === 2 && checkVicinity()) {
        swapCircles();
    }
}

checkVicinity = () => {
    if (clickedNumbers[0] === 1) {
        return clickedNumbers[1] === 2 || clickedNumbers[1] === 9;
    } else if (clickedNumbers[0] === 8) {
        return clickedNumbers[1] === 7 || clickedNumbers[1] === 16;
    } else if (clickedNumbers[0] === 57) {
        return clickedNumbers[1] === 49 || clickedNumbers[1] === 58;
    } else if (clickedNumbers[0] === 64) {
        return clickedNumbers[1] === 56 || clickedNumbers[1] === 63;
    } else if (leftEdge.indexOf(clickedNumbers[0]) >= 0) {
        return clickedNumbers[1] === clickedNumbers[0] - 8 || 
               clickedNumbers[1] === clickedNumbers[0] + 1 ||
               clickedNumbers[1] === clickedNumbers[0] + 8
    } else if (rightEdge.indexOf(clickedNumbers[0]) >= 0) {
        return clickedNumbers[1] === clickedNumbers[0] - 8 || 
               clickedNumbers[1] === clickedNumbers[0] - 1 ||
               clickedNumbers[1] === clickedNumbers[0] + 8
    } else {
        return clickedNumbers[1] === clickedNumbers[0] - 8 || 
               clickedNumbers[1] === clickedNumbers[0] - 1 ||
               clickedNumbers[1] === clickedNumbers[0] + 1 ||
               clickedNumbers[1] === clickedNumbers[0] + 8
    }
}

swapCircles = () => {
    let firstClicked = document.getElementById(clickedNumbers[0]);
    let secondClicked = document.getElementById(clickedNumbers[1]);
    let originalColor = firstClicked.style.backgroundColor;
        
    move(firstClicked, secondClicked);

    setTimeout(() => {
        firstClicked.style.animationName = '';
        secondClicked.style.animationName = '';
        firstClicked.style.backgroundColor = secondClicked.style.backgroundColor;
        secondClicked.style.backgroundColor = originalColor;
        updateBoard(false, firstClicked, secondClicked);
    }, 450);
}

move = (firstClicked, secondClicked) => {
    if (secondClicked.getBoundingClientRect().left > firstClicked.getBoundingClientRect().left) {
        secondClicked.style.animationName = 'slideLeft';
        firstClicked.style.animationName = 'slideRight';
    } else if (secondClicked.getBoundingClientRect().left < firstClicked.getBoundingClientRect().left) {
        secondClicked.style.animationName = 'slideRight';
        firstClicked.style.animationName = 'slideLeft';
    } else if (secondClicked.getBoundingClientRect().top > firstClicked.getBoundingClientRect().top) {
        secondClicked.style.animationName = 'slideUp';
        firstClicked.style.animationName = 'slideDown';
    } else if (secondClicked.getBoundingClientRect().top < firstClicked.getBoundingClientRect().top) {
        secondClicked.style.animationName = 'slideDown';
        firstClicked.style.animationName = 'slideUp';
    }
}

updateBoard = (firstCheck, firstClicked = null, secondClicked = null) => {
    //check board for matches
    let allCircles = Array.from(document.getElementsByClassName('circle'));
    let matchedCircles = [];
    allCircles.forEach((circle) => {
        let circleID = +circle.id;
        let circleColor = circle.style.backgroundColor;
        //start checking horizontal matches
        //make sure left edge circles don't wrap upwards to check right edge above
        if (leftEdge.indexOf(circleID) >= 1 || circleID === 57) {
            matchedCircles = matchDetection(matchedCircles, circleID, circleColor, 'addition', 1);
        //make sure right edge circles don't wrap downwards to check left edge below
        } else if (rightEdge.indexOf(circleID) >= 1 || circleID === 8) {
            matchedCircles = matchDetection(matchedCircles, circleID, circleColor, 'subtraction', 1);
        } else {
            matchedCircles = matchDetection(matchedCircles, circleID, circleColor, 'other', 1)
        }
        //check for vertical matches
        matchedCircles = matchDetection(matchedCircles, circleID, circleColor, 'addition', 8);
    })
    if (firstCheck && matchedCircles.length) {
        //ensure no matches on first load
        allCircles.forEach((circle) => {
            circle.style.backgroundColor = colors[Math.floor(Math.random() * 7)];
        })
        //randomized colors and recheck board
        updateBoard(true);
    } else if (!firstCheck && matchedCircles.length < 1 && firstClicked && secondClicked) {
        //reset circles if no match found
        let originalColor = firstClicked.style.backgroundColor;

        move(firstClicked, secondClicked);

        setTimeout(() => {
            firstClicked.style.animationName = '';
            secondClicked.style.animationName = '';
            firstClicked.style.backgroundColor = secondClicked.style.backgroundColor;
            secondClicked.style.backgroundColor = originalColor;
        }, 450);
    } else {
        //update all matched circles
        matchedCircles.forEach((circle) => {
            document.getElementById(circle).style.animationName = 'shrink';
        })

        setTimeout(function() {
            bringNewCircles(true);
        }, 850);

    }
}

matchDetection = (matchedCircles, circleID, circleColor, version, step) => {
    if (version === 'addition') {
        if (document.getElementById(circleID + step) && document.getElementById(circleID + step).style.animationName !== 'shrink' && document.getElementById(circleID + step).style.visibility !== 'hidden' && document.getElementById(circleID + step).style.backgroundColor === circleColor) {
            if (document.getElementById(circleID + (step * 2)) && document.getElementById(circleID + (step * 2)).style.backgroundColor === circleColor) {
                // 3 matches found
                matchedCircles.push(circleID);
                matchedCircles.push(circleID + step);
                matchedCircles.push(circleID + (step * 2));
                if (document.getElementById(circleID + (step * 3)) && document.getElementById(circleID + (step * 3)).style.backgroundColor === circleColor) {
                    // 4 matches, push the extra 1
                    matchedCircles.push(circleID + (step * 3));
                    if (document.getElementById(circleID + (step * 4)) && document.getElementById(circleID + (step * 4)).style.backgroundColor === circleColor) {
                        // 5 matches, push the extra 1
                        matchedCircles.push(circleID + (step * 4));
                    }
                }
            }
        }
    } else if (version === 'subtraction') {
        if (document.getElementById(circleID - step) && document.getElementById(circleID - step).style.animationName !== 'shrink' && document.getElementById(circleID - step).style.visibility !== 'hidden' && document.getElementById(circleID - step).style.backgroundColor === circleColor) {
            if (document.getElementById(circleID - (step * 2)) && document.getElementById(circleID - (step * 2)).style.backgroundColor === circleColor) {
                // 3 matches found
                matchedCircles.push(circleID);
                matchedCircles.push(circleID - step);
                matchedCircles.push(circleID - (step * 2));
                if (document.getElementById(circleID - (step * 3)) && document.getElementById(circleID - (step * 3)).style.backgroundColor === circleColor) {
                    // 4 matches, push the extra 1
                    matchedCircles.push(circleID - (step * 3));
                    if (document.getElementById(circleID - (step * 4)) && document.getElementById(circleID - (step * 4)).style.backgroundColor === circleColor) {
                        // 5 matches, push the extra 1
                        matchedCircles.push(circleID - (step * 4));
                    }
                }
            }
        }
    } else {
        if (document.getElementById(circleID - 1) && document.getElementById(circleID - 1).style.animationName !== 'shrink' && document.getElementById(circleID - 1).style.visibility !== 'hidden' && document.getElementById(circleID - 1).style.backgroundColor === circleColor && rightEdge.indexOf(circleID - 1) < 0 && circleID - 1 !== 8) {
            if (document.getElementById(circleID - 2) && document.getElementById(circleID - 2).style.backgroundColor === circleColor && rightEdge.indexOf(circleID - 2) < 0 && circleID - 2 !== 8) {
               // 3 matches found
                matchedCircles.push(circleID);
                matchedCircles.push(circleID - 1);
                matchedCircles.push(circleID - 2);
                if (document.getElementById(circleID - 3) && document.getElementById(circleID - 3).style.backgroundColor === circleColor && rightEdge.indexOf(circleID - 3) < 0 && circleID - 3 !== 8) {
                    // 4 matches, push the extra 1
                    matchedCircles.push(circleID - 3);
                    if (document.getElementById(circleID - 4) && document.getElementById(circleID - 4).style.backgroundColor === circleColor && rightEdge.indexOf(circleID - 4) < 0 && circleID - 4 !== 8) {
                        // 5 matches, push the extra 1
                        matchedCircles.push(circleID - 4);
                    }
                }
            }
        }
    }
    return matchedCircles;
}

bringNewCircles = (moveMade = false) => {
    let checkAgain = false;
    let circleList = Array.from(document.getElementsByClassName('circle'));
    circleList.forEach((circle) => {
        let circleID = +circle.id;
        if (document.getElementById(circleID + 8) && document.getElementById(circleID + 8).style.animationName === 'shrink') {
            checkAgain = true;
            
            if (document.getElementById(circleID).style.animationName !== 'shrink' && document.getElementById(circleID).style.visibility !== 'hidden') {
                document.getElementById(circleID + 8).style.backgroundColor = document.getElementById(circleID).style.backgroundColor;
            }
            
            document.getElementById(circleID + 8).style.animationName = '';
            document.getElementById(circleID).style.animationName = 'shrink';
            if (circleID - 8 < 1 || (document.getElementById(circleID - 8) && document.getElementById(circleID - 8).style.visibility === 'hidden')) {
                document.getElementById(circleID).style.animationName = '';
                document.getElementById(circleID).style.visibility = 'hidden';
            }
        }
    })
    if (checkAgain) {
        bringNewCircles();
    } else if (moveMade) {
        updateBoard(false);
    }
}