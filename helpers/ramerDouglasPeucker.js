function findPerpendicularDistance(point, line, attributeX, attributeY) {
    var pointX = point[attributeX],
        pointY = point[attributeY],
        lineStart = {
            x: line[0][attributeX],
            y: line[0][attributeY]
        },
        lineEnd = {
            x: line[1][attributeX],
            y: line[1][attributeY]
        },
        slope = (lineEnd.y - lineStart.y) / (lineEnd.x - lineStart.x),
        intercept = lineStart.y - (slope * lineStart.x),
        result;
    result = Math.abs(slope * pointX - pointY + intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
    //console.log(attributeX, attributeY);
    //console.log(pointX,pointY,lineStart,lineEnd);
    //console.log(slope, intercept, result);
    return result;
}

function douglasPeucker(points, attributes, epsilon) {
    var i,
        maxIndex = 0,
        maxDistance = 0,
        perpendicularDistance,
        leftRecursiveResults, rightRecursiveResults,
        filteredPoints,
        attributeX = attributes[0],
        attributeY = attributes[1];
    // console.log('Points', points.length );
    // console.log('Attributes', attributes);
    // console.log('Epsilon', epsilon);

    // find the point with the maximum distance
    for (i = 2; i < points.length - 1; i++) {
        perpendicularDistance = findPerpendicularDistance(points[i], [points[1], points[points.length - 1]], attributeX, attributeY);
        // console.log('perpendicularDistance', perpendicularDistance);
        if (perpendicularDistance > maxDistance) {
            maxIndex = i;
            maxDistance = perpendicularDistance;
        }
    }
    // if max distance is greater than epsilon, recursively simplify
    if (maxDistance >= epsilon) {
        leftRecursiveResults = douglasPeucker(points.slice(1, maxIndex), attributes, epsilon);
        rightRecursiveResults = douglasPeucker(points.slice(maxIndex), attributes, epsilon);
        filteredPoints = leftRecursiveResults.concat(rightRecursiveResults);
    } else
        filteredPoints = points;
    return filteredPoints;
}

exports.rdp = douglasPeucker;
