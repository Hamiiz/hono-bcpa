import { Hono } from 'hono'

const app = new Hono()


type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const users: User[] = [{
  id:'1',
  name:'alan',
  email:'alan@123.com',
  password:'password'
}];

app.get('/', (c) => {
  return c.text('Hello Hono!, not World')
});
app.get('/users', (c:any) => {
  return c.json(users);
});
app.get('/users/:id', (c:any) => {
  const id = c.req.param('id');

  const user = users.find((u:any) => u.id === id);

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user);
});

app.post('/signup', async (c) => {
  const body = await c.req.json();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return c.json({ error: 'All fields are required' }, 400);
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return c.json({ error: 'Email already exists' }, 400);
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;

  return c.json(userWithoutPassword, 201);
});

app.post('/signin', async (c:any) => {
  const body = await c.req.json();

  const { email, password } = body;

  const user = users.find((u:any) => u.email === email);

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  if (user.password !== password) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const { password: _, ...userWithoutPassword } = user;

  return c.json({
    message: 'Login successful',
    user: userWithoutPassword,
  });
});


export default app
