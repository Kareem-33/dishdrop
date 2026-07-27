export const verificationEmailTemplate = (verificationLink: string) => {
  return (`
    <div style="font-family: Arial, sans-serif;">
      <h2>Welcome to Dish Drop 🍽️</h2>

      <p>Please verify your email address.</p>

      <a
        href="${verificationLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:black;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Verify Email
      </a>

      <p>This link expires in 1 hour.</p>
    </div>
  `)
}