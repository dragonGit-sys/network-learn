import { redirect } from 'next/navigation';

/** Route lama — sekarang dilayani viewer generik di /part/01. */
export default function Part01Redirect() {
  redirect('/part/01');
}
