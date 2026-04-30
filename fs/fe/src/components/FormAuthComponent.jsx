export default function FormAuthComponent({ buttonTitle, isLoadingButton, onClickButton, children }){
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onClickButton();
      }}
      className='flex w-full flex-col gap-6'>
      {children}
      <button
        className='cursor-pointer'
        type='submit'
        disabled={isLoadingButton}
      >
        {isLoadingButton ? 'Loading...' : buttonTitle}
      </button>
    </form>
  );
}