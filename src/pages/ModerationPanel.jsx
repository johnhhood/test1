export default function Moderate() {
  return (
    <div className="moderate-container">
      <h1 className="moderate-title">Moderation Queue</h1>
    </div>
  );
}
const fetchPending = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_approved', false);

  if (error) console.error('Error fetching pending recipes:', error.message);
  else setPendingRecipes(data);
};
