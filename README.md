Agency Jekyll theme
====================

Agency theme based on [Agency bootstrap theme ](https://startbootstrap.com/template-overviews/agency/)

# How to use

###Portfolio 

Portfolio projects are in '/_posts'

Images are in '/img/portfolio'

###About

Images are in '/img/about/'

###Team

Team members and info are in '_config.yml'

Images are in '/img/team/'

# How to run locally
```sh
cd /path/to/AmpRobo.github.io
sudo apt install ruby-full build-essential zlib1g-dev
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
gem install bundler jekyll
bundle install
bundle exec jekyll serve
# Open http://localhost:4000 in your browser.
```
Ref: https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll?utm_source=chatgpt.com

## Contact form API

The Contact Us form sends submissions to `api/contact.js`, which creates an
Issue in `AmpRobo/AmpRobo.github.io`. The GitHub token is read only by the
Vercel Function and is never included in the generated website.

1. Import this repository into Vercel.
2. Create a fine-grained GitHub token with Issues read/write access to
   `AmpRobo/AmpRobo.github.io`.
3. Add the token in Vercel Project Settings > Environment Variables as
   `GITHUB_TOKEN`, then redeploy.
4. Create the `contact` and `website` labels in the GitHub repository.
5. Replace `contact_api_url` in `_config.yml` with the deployed Vercel URL,
   for example `https://your-project.vercel.app/api/contact`.

Requests are accepted from `https://amprobo.github.io` by default. For a
custom website domain, set `CONTACT_ALLOWED_ORIGINS` in Vercel to a
comma-separated list of complete origins, then redeploy.

When Jekyll is served from `localhost`, `127.0.0.1`, or `::1`, the form
automatically simulates a successful submission after validation. It does not
call Vercel or create a GitHub Issue. All other hostnames use the configured
production API URL, so switching environments requires no code changes.

# Demo

View this jekyll theme in action [here](https://y7kim.github.io/agency-jekyll-theme)

=========
For more details, read [documentation](http://jekyllrb.com/)
