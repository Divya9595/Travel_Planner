import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import { fetchTrips } from "../src/store/slices/tripSlice";

function Home() {
  const { user } = useSelector((state) => state.auth);
  const { previousTrips, loading } = useSelector((state) => state.trips);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-900 px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name || "Traveller"} 👋
            </h1>
            <p className="text-slate-400 mt-1">
              {previousTrips.length > 0
                ? `You have ${previousTrips.length} trip${previousTrips.length > 1 ? "s" : ""} saved.`
                : "Start planning your next adventure!"}
            </p>
          </div>

          {/* My Trips */}
          {loading ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-6">⏳</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Loading your trips...
              </h2>
            </div>
          ) : previousTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {previousTrips.map((trip) => (
                <Link
                  key={trip._id}
                  to={`/dashboard/trips/${trip._id}`}
                  className="rounded-2xl bg-slate-800 border border-slate-700/50 p-6 hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all group"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">
                    {trip.destination}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {trip.dateFrom} - {trip.dateTo} · {trip.travellers} traveller
                    {trip.travellers > 1 ? "s" : ""}
                  </p>
                  <span className="inline-block mt-3 text-xs text-indigo-400 font-medium">
                    View Details →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-6">🌍</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                No Trips Yet
              </h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                You don't have any saved trips. Start planning your first
                adventure!
              </p>
              <Link
                to="/dashboard/trips"
                className="inline-block rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all hover:scale-105"
              >
                Plan a Trip
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
