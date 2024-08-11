let text = document.getElementById('text');
let leaf = document.getElementById('leaf');
let hill1 = document.getElementById('hill1');
let hill4 = document.getElementById('hill4');
let hill5 = document.getElementById('hill5');

let defaultValue = 90;
let currentValue = defaultValue;

function updateValue() {
    let windowWidth = window.innerWidth;
    let initialWidth = 1000;
    let percentageChange = ((initialWidth - windowWidth) / initialWidth) * 50000;
    let valueChange = Math.floor(percentageChange / 5);
    currentValue = defaultValue + valueChange;
    if (currentValue < 50) currentValue = 50;
    if (currentValue > 150) currentValue = 150;
}

window.addEventListener('resize', updateValue);
updateValue();

window.addEventListener('scroll', () => {
    let val = currentValue / 100;
    let value = val * window.scrollY;
    let maxScrollValue = window.innerHeight;
    value = value > maxScrollValue ? maxScrollValue : value;
    text.style.marginTop = value * 2.5 + 'px';
    leaf.style.top = value * -1.5 + 'px';
    leaf.style.left = value * 1.5 + 'px';
    hill5.style.left = value * 1.5 + 'px';
    hill4.style.left = value * -1.5 + 'px';
    hill1.style.top = value * 1 + 'px';
});

document.addEventListener('DOMContentLoaded', () => {
    fetch("data.json")
    .then(response => response.json())
    .then(products => {
        let placeholder = document.querySelector("#data-output");

        let out = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.company}</td>
                <td>${product.new}</td>
                <td>${product.featured}</td>
                <td>${product.position}</td>
                <td>${product.role}</td>
                <td>${product.level}</td>
                <td>${product.postedAt}</td>
                <td>${product.contract}</td>
                <td>${product.location}</td>
                <td>${product.languages}</td>
                <td>${product.tools}</td>
            </tr>
        `).join('');
        placeholder.innerHTML = out;

        getUniqueValuesFromColumn();
    })
    .catch(error => console.error('Error loading data:', error));

    function getUniqueValuesFromColumn() {
        var unique_col_values_dict = {};
        var allFilters = document.querySelectorAll(".table-filter");

        allFilters.forEach((filter_i) => {
            var col_index = filter_i.parentElement.getAttribute("col-index");
            const rows = document.querySelectorAll("#data-output > tr");

            rows.forEach((row) => {
                var cell_value = row.querySelector("td:nth-child(" + col_index + ")").innerHTML;

                if (col_index === '12' || col_index === '11') {
                    cell_value = cell_value.split(',').map(tool => tool.trim());
                } else {
                    cell_value = [cell_value];
                }

                if (col_index in unique_col_values_dict) {
                    cell_value.forEach(value => {
                        if (!unique_col_values_dict[col_index].includes(value)) {
                            unique_col_values_dict[col_index].push(value);
                        }
                    });
                } else {
                    unique_col_values_dict[col_index] = cell_value;
                }
            });
        });

        updateSelectOptions(unique_col_values_dict);
    }

    function updateSelectOptions(unique_col_values_dict) {
        var allFilters = document.querySelectorAll(".table-filter");

        allFilters.forEach((filter_i) => {
            var col_index = filter_i.parentElement.getAttribute('col-index');

            filter_i.innerHTML = '<option value="all">All</option>';

            var sortedValues = unique_col_values_dict[col_index].sort((a, b) => a.localeCompare(b));

            sortedValues.forEach((value) => {
                filter_i.innerHTML += `\n<option value="${value}">${value}</option>`;
            });
        });
    }

    function filter_rows(searchValue = '') {
        var allFilters = document.querySelectorAll(".table-filter");
        var filter_value_dict = {};

        allFilters.forEach((filter_i) => {
            var col_index = filter_i.parentElement.getAttribute('col-index');
            var value = filter_i.value;
            if (value !== "all") {
                filter_value_dict[col_index] = value;
            }
        });

        const rows = document.querySelectorAll("#data-output tr");
        rows.forEach((row) => {
            var display_row = true;

            allFilters.forEach((filter_i) => {
                var col_index = filter_i.parentElement.getAttribute('col-index');
                var row_cell_value = row.querySelector("td:nth-child(" + col_index + ")").innerHTML;

                if (col_index === '12' || col_index === '11') {
                    row_cell_value = row_cell_value.split(',').map(tool => tool.trim());
                } else {
                    row_cell_value = [row_cell_value];
                }

                if (filter_value_dict[col_index] && !row_cell_value.includes(filter_value_dict[col_index])) {
                    display_row = false;
                }
            });

            if (searchValue && !row.querySelector("td:nth-child(1)").textContent.toLowerCase().includes(searchValue)) {
                display_row = false;
            }

            row.style.display = display_row ? "table-row" : "none";
        });

        const visibleRows = Array.from(rows).filter(row => row.style.display !== "none");
        document.querySelector("#matches").style.display = visibleRows.length ? 'block' : 'none';
        document.querySelector("#no-matches").style.display = visibleRows.length ? 'none' : 'block';
    }

    document.querySelectorAll(".table-filter").forEach(filter => {
        filter.addEventListener("change", function() {
            const searchValue = document.querySelector("#search-input").value.toLowerCase();
            filter_rows(searchValue);
        });
    });

    document.querySelector("#search-input").addEventListener("input", function() {
        const searchValue = this.value.toLowerCase();
        filter_rows(searchValue);
    });

    document.getElementById('reset-btn').addEventListener('click', function(event) {
        event.preventDefault();

        document.getElementById('search-input').value = '';

        const filters = document.querySelectorAll('.table-filter');
        filters.forEach(function(filter) {
            filter.value = 'all';
        });

        filter_rows();
    });
});

window.onload = function() {
    var loader = document.getElementById('loader');
    setTimeout(function() {
        loader.style.display = 'none';
    }, 1900);
};

function adjustJoblistHeight() {
    setTimeout(() => {
        const hill5 = document.getElementById('hill5');
        const joblist = document.querySelector('.joblist');
        if (hill5 && joblist) {
            joblist.style.height = hill5.clientHeight + 'px';
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    adjustJoblistHeight();
    window.addEventListener('resize', adjustJoblistHeight);
});

document.documentElement.style.overflowX = 'hidden';
document.body.style.overflowX = 'hidden';
document.documentElement.style.width = '100%';
document.body.style.width = '100%';
window.addEventListener('scroll', function() {
    if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
    }
});


function startAutoScrollOnIdle(timeout = 5000, scrollSpeed = 1, intervalTime = 20, pauseDuration = 5000) {
    let scrollInterval;
    let idleTimeout;
    let activityTimeout;
    let scrollDirection = 1;
    let isPaused = false;
    let isActive = false;

    function startAutoScroll() {
        scrollInterval = setInterval(() => {
            if (isPaused) return;

            let scrollTop = window.scrollY;
            let scrollHeight = document.documentElement.scrollHeight;
            let viewportHeight = window.innerHeight;

            if (scrollDirection === 1 && (scrollTop + viewportHeight >= scrollHeight)) {
                pauseScroll(pauseDuration);
                scrollDirection = -1;
            } else if (scrollDirection === -1 && scrollTop <= 0) {
                pauseScroll(pauseDuration);
                scrollDirection = 1;
            }

            window.scrollBy(0, scrollSpeed * scrollDirection);
        }, intervalTime);
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
    }

    function pauseScroll(duration) {
        isPaused = true;
        setTimeout(() => {
            isPaused = false;
        }, duration);
    }

    function resetTimer() {
        if (isActive) {
            clearTimeout(idleTimeout);
            clearTimeout(activityTimeout);

            stopAutoScroll();

            activityTimeout = setTimeout(() => {
                if (isActive) {
                    startAutoScroll();
                }
            }, timeout);
        }
    }

    function toggleAutoScroll() {
        isActive = document.getElementById('toggleSwitch').checked;
        if (!isActive) {
            stopAutoScroll();
            clearTimeout(idleTimeout);
            clearTimeout(activityTimeout);
        } else {
            resetTimer();
        }
    }

    document.getElementById('toggleSwitch').addEventListener('change', toggleAutoScroll);

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
}

startAutoScrollOnIdle();