import axios from 'axios';

let debounceTimeout;

const syncMiddleware = (store) => (next) => (action) => {
  // Let the action pass through first so the state gets updated
  const result = next(action);

  // If the action is a study slice mutation (and not the initial fetch or pending/rejected states)
  if (
    action.type?.startsWith('study/') && 
    !action.type.includes('fetchStudyData') &&
    !action.type.includes('setStudyData')
  ) {
    // Clear previous timeout to debounce
    if (debounceTimeout) clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {
      const state = store.getState();
      const user = state.auth.user;
      
      // Only sync if user is logged in
      if (user && user.token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          
          // Send the entire study state to replace/update backend
          await axios.put('http://localhost:5000/api/studydata', state.study, config);
          // console.log('Study data synced to backend!');
        } catch (error) {
          console.error('Failed to sync study data to backend:', error);
        }
      }
    }, 1500); // 1.5 second debounce to prevent spamming API
  }

  return result;
};

export default syncMiddleware;
