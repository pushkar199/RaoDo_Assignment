interface UserEntry {
    userId: string;
    loginTimestamp: Date;
    logoutTimestamp?: Date;
    lastSeenAtTimestamp: Date;
}

interface MonthlyUserCounts {
    loggedInUsers: Map<string, number>; // Map<monthYearString, count>
    activeUsers: Map<string, number>; // Map<monthYearString, count>
}

function calculateMonthlyUserCounts(userEntries: UserEntry[]): MonthlyUserCounts {
    const monthlyCounts: MonthlyUserCounts = {
        loggedInUsers: new Map<string, number>(),
        activeUsers: new Map<string, number>()
    };

    // Iterate through user entries
    for (const entry of userEntries) {
        const monthYearKey = getMonthYearKey(entry.loginTimestamp);

        // Increment logged in users count for the month
        const loggedInCount = monthlyCounts.loggedInUsers.get(monthYearKey) || 0;
        monthlyCounts.loggedInUsers.set(monthYearKey, loggedInCount + 1);

        // Check if the user is active for the month
        const isActive = isUserActive(entry);
        if (isActive) {
            // Increment active users count for the month
            const activeCount = monthlyCounts.activeUsers.get(monthYearKey) || 0;
            monthlyCounts.activeUsers.set(monthYearKey, activeCount + 1);
        }
    }

    return monthlyCounts;
}

function getMonthYearKey(date: Date): string {
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month.toString().padStart(2, '0')}`;
}

function isUserActive(entry: UserEntry): boolean {
    const { loginTimestamp, logoutTimestamp, lastSeenAtTimestamp } = entry;
    // Check if user has logged out, or if lastSeenAtTimestamp is within the month
    return !logoutTimestamp || (lastSeenAtTimestamp >= loginTimestamp && lastSeenAtTimestamp.getMonth() === loginTimestamp.getMonth());
}

// Example usage:
const userEntries: UserEntry[] = [
    { userId: "user1", loginTimestamp: new Date("2024-01-05"), logoutTimestamp: new Date("2024-01-07"), lastSeenAtTimestamp: new Date("2024-01-06") },
    { userId: "user2", loginTimestamp: new Date("2024-01-10"), lastSeenAtTimestamp: new Date("2024-01-15") },
    { userId: "user3", loginTimestamp: new Date("2024-02-05"), lastSeenAtTimestamp: new Date("2024-02-08") },
    // Add more user entries as needed
];

const monthlyUserCounts = calculateMonthlyUserCounts(userEntries);
console.log("Monthly logged in users:", monthlyUserCounts.loggedInUsers);
console.log("Monthly active users:", monthlyUserCounts.activeUsers);
