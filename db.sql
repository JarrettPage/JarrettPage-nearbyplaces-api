create table nearbyplaces.place
(
	id bigserial primary key,
	name text not null,
	location text not null
);

create table nearbyplaces.customer
(
	id bigserial primary key,
	name text not null,
	password text not null,
	email text not null
);

create table nearbyplaces.review
(
	id bigserial primary key,
	placeid integer references nearbyplaces.place(id),
	comment text,
	rating integer,
	customerid integer references nearbyplaces.customer(id)
);