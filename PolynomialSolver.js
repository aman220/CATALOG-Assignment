// module used to take file as input
const fs = require('fs');

// used to decode value from given base to base10
function decodeValue(base, value) {
    return parseInt(value, base);
}

// used to pass jsoninput and calculate data 
function parseInput(jsonInput) {
    const data = JSON.parse(jsonInput);
    const n = data.keys.n;
    const k = data.keys.k;
    const points = [];

    for (const key in data) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const y = decodeValue(data[key].base, data[key].value);
            points.push([x, y]);
            console.log(`Decoded y value for x=${x}: ${y}`);
        }
    }
    return { n, k, points };
}

//used to perfom Lagrange interpolation to compute the secret constant term
function lagrangeInterpolation(points, k) {

    
    function basisPolynomial(i, x) {
        let result = 1; 
        const [xi, yi] = points[i];
        for (let j = 0; j < k; j++) {
            if (i !== j) { 
                const [xj, _] = points[j]; 
                result *= (x - xj) / (xi - xj);
            }
        }

        return result; // Return the result of the basis polynomial
    }

    // Function to interpolate the polynomial at x = 0 (we are interested in f(0))
    function interpolate(x) {
        let result = 0;
        for (let i = 0; i < k; i++) {
            const [xi, yi] = points[i]; 
            result += yi * basisPolynomial(i, x);
        }

        return result; 
    }
    return interpolate(0);
}

// Read the JSON input from a file called "testcase2.json"
const jsonInput = fs.readFileSync("testcase2.json");

// Parse the input to extract n, k, and points array
const { n, k, points } = parseInput(jsonInput);

// Perform Lagrange interpolation to compute the secret constant term
const secretC = lagrangeInterpolation(points, k);

// Output the result (the secret constant term c)
console.log(`The secret constant term c is: ${secretC}`);
