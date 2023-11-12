import ClipLoader from "react-spinners/ClipLoader";
export default function Loading({ isLoading, size, variant }) {
  return (
    <div
      className={`${
        variant == "page" &&
        "w-screen h-screen flex items-center justify-center"
      }`}
    >
      <ClipLoader
        color="#ffffff"
        loading={isLoading}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
