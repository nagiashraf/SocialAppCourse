namespace API.SignalR
{
  public interface IPresenceClient
    {
        Task UserIsOnline(string username);
        Task UserIsOffline(string username);
        Task GetOnlineUsers(string[] onlineUsers);
        Task NewMessageReceived(string username, string knownAs);
    }
}