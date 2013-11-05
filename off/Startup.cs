using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(off.Startup))]
namespace off
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
