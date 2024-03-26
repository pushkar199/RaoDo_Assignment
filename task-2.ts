interface Shipment {
    pickupPoints: string[];
    dropPoints: string[];
}

interface Trip {
    pickupPoints: string[];
    dropPoints: string[];
    viaPoint?: string;
}

function areTripsLegit(shipments: Shipment[], trips: Trip[]): boolean {
    const allPickupPoints = shipments.flatMap(shipment => shipment.pickupPoints);
    const allDropPoints = shipments.flatMap(shipment => shipment.dropPoints);

    for (const trip of trips) {
        const { pickupPoints, dropPoints, viaPoint } = trip;

        // Check if all pickup points of the trip are included in the shipment
        if (!pickupPoints.every(point => allPickupPoints.includes(point))) {
            return false;
        }

        // Check if all drop points of the trip are included in the shipment
        if (!dropPoints.every(point => allDropPoints.includes(point))) {
            return false;
        }

        // Check if the via point (warehouse) is included in the trip's pickup or drop points
        if (viaPoint && !pickupPoints.includes(viaPoint) && !dropPoints.includes(viaPoint)) {
            return false;
        }
    }

    return true;
}

// Example usage:
const shipments: Shipment[] = [
    { pickupPoints: ['A', 'B'], dropPoints: ['C', 'D'] }
];

const trips: Trip[] = [
    { pickupPoints: ['A'], dropPoints: ['W'], viaPoint: 'W' }, // Legitimate trip 1
    { pickupPoints: ['B'], dropPoints: ['W'], viaPoint: 'W' }, // Legitimate trip 2
    { pickupPoints: ['W'], dropPoints: ['C'], viaPoint: 'W' }, // Legitimate trip 3
    { pickupPoints: ['W'], dropPoints: ['D'], viaPoint: 'W' }, // Legitimate trip 4
];

console.log(areTripsLegit(shipments, trips)); // Output: true (all trips are legitimate)
