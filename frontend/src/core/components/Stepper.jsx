export default function Stepper({ value, onDecrement, onIncrement, min = 0, max = 9999 }) {
  return (
    <div className="stepper" role="group" aria-label={`Value: ${value}`}>
      <button
        className="stepper-btn"
        onClick={onDecrement}
        disabled={value <= min}
        aria-label="Decrease"
        id={`stepper-dec-${Math.random().toString(36).substr(2,5)}`}
      >
        −
      </button>
      <span className="stepper-value" aria-live="polite">{value}</span>
      <button
        className="stepper-btn"
        onClick={onIncrement}
        disabled={value >= max}
        aria-label="Increase"
        id={`stepper-inc-${Math.random().toString(36).substr(2,5)}`}
      >
        +
      </button>
    </div>
  );
}
