Backend:
[x] Users can have multiple memberships each for one club
[x] Registration in a club require the approval of the president
[ ] Registration of a new club by a user requires the approval of the Admin (just to maintain control)
	1- The user contacts the Admin
	2- The Admin creates the club and assigns him the president
[ ] Only the president can adjust the roles of club members: (Manager, Member)
[ ] Managers can add, edit, delete content for the club
[ ] Managers deletion of content is restricted to the one who posted it
[ ] Members can promise to attend events (Used in statistics)
[ ] Managers can note those who promised to attend and did not (Used in statistics)
[ ] Managers can assign people to events with eventual roles/responsibilites


[ ] For all privileges: President > Manager > Member

Frontend:
Responsive design (Mobile, Tablet, Laptop/Desktop)
Filter clubs in "activites page"
Pages:
	Events => Event Details
	Clubs => Club Details
	Management Panel (Used by President):
		Members [ID, Name, Email, Join Date, Role]
		Event [ID, Author, Title, Date, People in charge]
Statistics Reports (Used by Admin):
	Most active club
	Most active member in club
	Number of active members: total/per club
	Number of members: total/per club
	Number of posts: total/per club
	Number of visits last week
	