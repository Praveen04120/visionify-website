async function test() {
  console.log("Testing Community Collaboration Form...");
  const res = await fetch("http://localhost:3000/api/community", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      community_name: "Test Community",
      email: "test@example.com",
      phone: "+91 9999999999",
      message: "This is a test message."
    })
  });
  const data = await res.json();
  console.log("Community Form Response:", res.status, data);

  // Get Admin session
  const loginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "KetikaVisionify@123" })
  });
  const cookieHeader = loginRes.headers.get("set-cookie");
  console.log("Login Status:", loginRes.status);
  
  if (!cookieHeader) {
    console.error("No cookie returned from login");
    return;
  }
  
  const sessionCookie = cookieHeader.split(';')[0];
  console.log("Using cookie:", sessionCookie);

  // Test admin collaborators
  const collabRes = await fetch("http://localhost:3000/api/admin/collaborators", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Cookie": sessionCookie 
    },
    body: JSON.stringify({
      title: "Test Partner",
      image_url: "https://example.com/logo.png",
      description: "Test Description",
      display_order: 1,
      is_active: true
    })
  });
  const collabData = await collabRes.json();
  console.log("Collaborators POST Response:", collabRes.status, collabData);

  if (collabRes.status === 200) {
    // Delete the collaborator to clean up
    const delRes = await fetch(`http://localhost:3000/api/admin/collaborators/${collabData.id}`, {
      method: "DELETE",
      headers: {
        "Cookie": sessionCookie
      }
    });
    console.log("Collaborator DELETE Response:", delRes.status);
  }
}

test().catch(console.error);
