import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Favourites() {
  useDocumentTitle('Favorieten');

  return (
    <div>
      <h1>Favourites Page</h1>
    </div>
  );
}