<svelte:head>
	<title>Contact me</title>
</svelte:head>
<h1> Contact </h1>


  <div class="container">
    <form action="mailto:danmor@mit.edu" method="post" enctype="text/plain">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Your email.">
      <br />
      <label for="subject">Subject</label>
      <input type="text" id="subject" name="subject" placeholder="Subject of the email.">
      <br />
      <label for="body">Body</label>
      <textarea id="body" name="Body" placeholder="Write something.." style="height:200px"></textarea>
      <br />
      <input class="submit" type="submit" value="Submit">
    </form>
  </div>