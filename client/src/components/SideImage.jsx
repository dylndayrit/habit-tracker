export default function SideImage({ src, alt="fun gif" }) {
  return (
    <div style={{ display:"grid", placeItems:"center", minHeight:0 ,  margin:"1em", minWidth: 0}}>
      <img src={src} alt={alt} style={{ maxWidth:"100%", borderRadius:8, maxHeight: "100%"}} />
    </div>
  );
}
