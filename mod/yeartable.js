function createTable() {
    let table = document.getElementById('yeartable')
    table.setAttribute('cellspacing', '2')
    let tableBody = document.createElement('tbody')

    for (let i = 0; i < 12; i++) {
        let row = document.createElement('tr')
        let dayCells = []

        for (let j = 0; j < getDaysInMonth(i); j++) {
            let cell = document.createElement('td')
            cell.title = cellsGoals[i][j]
            dayCells.push(cell)

            let weekIndex = document.createElement('div')
            weekIndex.className = 'week_index'
            cell.appendChild(weekIndex)

            let innerIcon = document.createElement('div')
            innerIcon.className = 'inner_icon'
            cell.appendChild(innerIcon)

            cell.addEventListener('click', function () {
                toggleCellState([i, j])
            })
            cell.addEventListener('long-press', function (e) {
                setCellState([i, j], 0)
            })
            cell.setAttribute('data-long-press-delay', 400)
            cell.addEventListener('contextmenu', function (e) {
                let text = prompt('Note:', cellsGoals[i][j])
                if (text !== null) {
                    updateCellGoal([i, j], text)
                }
                e.preventDefault()
            }, false)

            row.appendChild(cell)
        }

        tableBody.appendChild(row)
        cells.push(dayCells)
    }

    table.appendChild(tableBody)
}

function refreshTable() {
    let weekIt = 0
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < getDaysInMonth(i); j++) {
            refreshCellState([i, j])
            refreshCellGoal([i, j])
            if (new Date(date.getFullYear(), i, j + 1).getDay() == 1) { //if monday
                cells[i][j].getElementsByClassName('week_index')[0].innerHTML = ++weekIt
            }
        }
    }
    highlightCurrentDay()
}

function getDaysInMonth(month) {
    return new Date(date.getFullYear(), month + 1, 0).getDate()
}

function getDaysInMonthInLeapYear(month) {
    return new Date(2000, month + 1, 0).getDate()
}

function toggleCellState(index) {
    if (cellsStates[index[0]][index[1]]++ >= 7) {
        cellsStates[index[0]][index[1]] = 0
    }
    refreshCellState(index)
    updateLocalStorage()
}

function setCellState(index, state) {
    cellsStates[index[0]][index[1]] = state
    refreshCellState(index)
    updateLocalStorage()
}

function refreshCellState(index) {
    let tmp
    switch (Number(cellsStates[index[0]][index[1]])) {
        case 0:
            tmp = ''
            break;
        case 1:
            tmp = '<svg><use href="#clear-icon"></svg>'
            break;
        case 2:
            tmp = '<svg><use href="#star-icon"></svg>'
            break;
        case 3:
            tmp = '<svg><use href="#favorite-icon"></svg>'
            break;
        case 4:
            tmp = '<svg><use href="#fire-icon"></svg>'
            break;
        case 5:
            tmp = '<svg><use href="#satisfied-icon"></svg>'
            break;
        case 6:
            tmp = '<svg><use href="#neutral-icon"></svg>'
            break;
        case 7:
            tmp = '<svg><use href="#dissatisfied-icon"></svg>'
            break;
        default:
            break;
    }
    cells[index[0]][index[1]].getElementsByClassName('inner_icon')[0].innerHTML = tmp
}

function updateCellGoal(index, text) {
    cellsGoals[index[0]][index[1]] = text
    refreshCellGoal(index)
    highlightCurrentDay()
    updateLocalStorage()
}

function refreshCellGoal(index) {
    let tmp
    if (cellsGoals[index[0]][index[1]] != '') {
        tmp = getComputedStyle(document.documentElement).getPropertyValue('--cell-goal-background-color')
    } else {
        tmp = getComputedStyle(document.documentElement).getPropertyValue('--cell-background-color')
    }
    cells[index[0]][index[1]].title = cellsGoals[index[0]][index[1]].replaceAll('\\n', '\n')
    cells[index[0]][index[1]].style.backgroundColor = tmp
}

function highlightCurrentDay() {
    cells[date.getMonth()][date.getDate() - 1].style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cell-highlight-color')
}

function updateLocalStorage() {
    window.localStorage.setItem('cellsStates', JSON.stringify(cellsStates))
    window.localStorage.setItem('cellsGoals', JSON.stringify(cellsGoals))
    window.localStorage.setItem('year', JSON.stringify(year))
}

/*********************************************************/

var date = new Date()

let year = JSON.parse(window.localStorage.getItem('year'))
let currentYear = date.getFullYear()

var cellsStates = []
var cellsGoals = []

let colStates = []
let colGoals = []
for (let i = 0; i < 12; i++) {
    let rowStates = []
    let rowGoals = []
    for (let j = 0; j < getDaysInMonthInLeapYear(i); j++) {
        rowStates.push(0)
        rowGoals.push('')
    }
    colStates.push(rowStates)
    colGoals.push(rowGoals)
}
cellsStates = colStates
cellsGoals = colGoals

if (year === null) { //on the first launch
    year = currentYear
} else if (year != currentYear) { //on the first launch in the year
    let clear = confirm('Happy New Year! Click "OK" to clean the previous table')
    if (clear === true) {
        year = currentYear
        updateLocalStorage()
    } else {
        date = new Date(year, 0)
        cellsStates = JSON.parse(window.localStorage.getItem('cellsStates'))
        cellsGoals = JSON.parse(window.localStorage.getItem('cellsGoals'))
    }
} else { //on the default launch
    cellsStates = JSON.parse(window.localStorage.getItem('cellsStates'))
    cellsGoals = JSON.parse(window.localStorage.getItem('cellsGoals'))
}
// document.getElementById('year').innerText = year

var cells = []

createTable()
refreshTable()