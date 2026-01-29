export default function SideImage({ src, alt="fun gif" }) {
  return (
    <img src={src} alt={alt} style={{ width:"100%", borderRadius:10, height: "100%", objectFit:"cover"}} />
  );
}
