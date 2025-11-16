import { cva } from 'class-variance-authority';

export const selectVariants = cva(
  'shw-select tw:text-sm tw:font-bold tw:leading-normal tw:bg-transparent tw:outline-none tw:cursor-pointer tw:transition-all tw:duration-200 tw:ease-in-out disabled:tw:opacity-60 disabled:tw:cursor-not-allowed disabled:tw:bg-black/5',
  {
    variants: {
      variant: {
        bordered:
          'tw:border-solid tw:border tw:border-(--color-border-light-2) tw:hover:border-(--color-border-dark) tw:focus:border-(--color-primary) tw:rounded tw:py-1 tw:px-2 tw:focus:shadow-[0_0_0_2px_rgba(0,102,204,0.1)]',
        underline:
          'tw:border-0 tw:border-b tw:border-solid tw:border-b-(--color-border-light-2) tw:hover:border-b-(--color-border-dark) tw:focus:border-b-(--color-primary) tw:rounded-none tw:py-1 tw:px-2 tw:focus:shadow-none',
      },
      fullWidth: {
        true: 'tw:w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'bordered',
      fullWidth: false,
    },
  },
);
