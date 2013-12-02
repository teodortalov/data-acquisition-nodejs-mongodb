<h1 id="data-acquisition-nodejs-mongodb">Solar Cloud - Florida Gulf Coast Unviersity</h1>
<h2>Data Acquisition NodeJS, MongoDB and CR1000 datalogger</h2>

<h2 id="Requirements">Requirements:</h2>
<ul>
<li>nodejs</li>
<li>mongo</li>
<li>ruby</li>
<li>lamp</li>
</ul>

<h2 id="installation">Installation:</h2>
<p>Checkout github repostory</p>
<p><pre><code>git clone git@github.com:teodortalov/data-acquisition-nodejs-mongodb.git solarcloud</code></pre></p>
<p>Navigate into the app folder</p>
<p><pre><code>cd solarcloud</code></pre></p>
<p>Install dependencies</p>
<p><pre><code>sudo npm install</code></pre></p>
<p>Install js-yaml (<a href="https://github.com/teodortalov/data-acquisition-nodejs-mongodb/issues/1">see issue #1</a>)</p>
<p><pre><code>sudo npm install js-yaml</code></pre></p>
<p>Run Fetcher</p>
<p><pre><code>node fetcher</code></pre></p>
<p>&nbsp;</p>
<p>Run fetcher in background</p>
<pre><code>nohup node fetcher&</code></pre>
<h2 id="tools">Tools:</h2>
<h3 id="install-genghis-to-manage-mongodb-data">Install Genghis to manage MongoDB data</h3>
<p>See installation instructions at: https://github.com/bobthecow/genghis</p>
<p>Running Genghis from command line</p>
<pre><code>genghisapp
</code></pre>

<p>You should see response like this:</p>
<pre><code>[2013-12-02 00:05:29 -0500] Starting 'genghisapp'...
[2013-12-02 00:05:29 -0500] 'genghisapp' is already running at http://0.0.0.0:5678
</code></pre>

<p>You can access the application at:</p>
<pre><code>your-houst.com:5678
</code></pre>

<h3>MongoDB shortcuts</h3>
<p>Get last 3 or n records<p>
<pre><code>db.readings.find().sort( { _id : -1 } ).limit(3).pretty()</code></pre>
