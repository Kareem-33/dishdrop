export const resetPasswordEmailTemplate = (resetLink: string) => {
  return (`
    <div style="font-family: Arial;">
      <h2>Dish Drop Password Reset</h2>

      <p>Click below to reset your password:</p>

      <a
        href="${resetLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:black;
          color:white;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
    </div>
  `)
};