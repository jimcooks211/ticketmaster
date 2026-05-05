// Debug Script - Check Admin Data and Events
// Run this in browser console to diagnose the issue

console.log("=== ADMIN DATA DEBUG ===");

// 1. Check current session
console.log("Current Session:");
console.log("  Admin ID:", localStorage.getItem('currentAdminId'));
console.log("  Admin Username:", localStorage.getItem('currentAdminUsername'));
console.log("  Is Logged In:", localStorage.getItem('isAdminLoggedIn'));

// 2. Get all admin users
const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
console.log("\nAll Admin Users:", adminUsers.length);
adminUsers.forEach((admin, index) => {
  console.log(`  Admin ${index + 1}:`, admin.username, `(${admin.events?.length || 0} events)`);
});

// 3. Check current admin's events
const currentAdminId = localStorage.getItem('currentAdminId');
const currentAdmin = adminUsers.find(user => user.id === currentAdminId);

if (currentAdmin) {
  console.log("\nCurrent Admin:", currentAdmin.username);
  console.log("  Events:", currentAdmin.events?.length || 0);
  console.log("  Event Details:", currentAdmin.events);
} else {
  console.log("\n⚠️ No current admin found!");
  console.log("  You might not be logged in properly.");
}

// 4. Check all events across all admins
console.log("\nAll Events Across All Admins:");
let totalEvents = 0;
adminUsers.forEach((admin, index) => {
  if (admin.events && admin.events.length > 0) {
    console.log(`  ${admin.username}'s events:`);
    admin.events.forEach((event, eventIndex) => {
      console.log(`    ${eventIndex + 1}. ${event.name} (ID: ${event.id})`);
      totalEvents++;
    });
  }
});
console.log(`  Total events: ${totalEvents}`);

// 5. Check for old data in different keys
console.log("\nChecking for old data keys:");
const oldEvents = localStorage.getItem('adminEvents');
if (oldEvents) {
  console.log("  ⚠️ Found old 'adminEvents' key with data!");
  console.log("  This might be causing confusion.");
  console.log("  Events:", JSON.parse(oldEvents));
} else {
  console.log("  No old 'adminEvents' key found.");
}

// 6. Summary
console.log("\n=== SUMMARY ===");
if (currentAdmin) {
  console.log(`Logged in as: ${currentAdmin.username}`);
  console.log(`Your events: ${currentAdmin.events?.length || 0}`);
  console.log(`Total events in system: ${totalEvents}`);

  if (currentAdmin.events?.length === 0 && totalEvents > 0) {
    console.log("\n⚠️ ISSUE FOUND!");
    console.log("You have no events, but other admins do.");
    console.log("The events you see in the main app were created by other admins.");
    console.log("\nSOLUTIONS:");
    console.log("1. Check which admin created the events (see 'All Events' above)");
    console.log("2. Login as that admin to see/edit their events");
    console.log("3. Or create your own events");
  }
} else {
  console.log("⚠️ Not properly logged in!");
  console.log("Please login again at /admin");
}

console.log("\n=== END DEBUG ===");