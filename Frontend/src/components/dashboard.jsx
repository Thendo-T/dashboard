import Headers from "../Utils/header";

export default function Dashboard() {
  return (
    <div>
      <Headers />
      <div className="grid grid-cols-5 grid-rows-5 gap-4">
        <div className="col-start-2">2</div>
        <div className="col-start-3">3</div>
        <div className="col-start-4">4</div>
        <div className="col-start-3 row-start-2">5</div>
        <div className="row-start-3">6</div>
        <div className="col-start-5 row-start-3">7</div>
        <div className="col-start-2 row-start-4">8</div>
        <div className="col-start-4 row-start-4">9</div>
      </div>
    </div>
  );
}
