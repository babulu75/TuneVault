export default function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {initials}
    </div>
  )
}
