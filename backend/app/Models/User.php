<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array&lt;int, string&gt;
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',        'store_limit',    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array&lt;int, string&gt;
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array&lt;string, string&gt;
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'store_limit' => 'integer',
    ];

    /**
     * Get the stores managed by this user.
     */
    public function stores()
    {
        return $this->hasMany(Store::class, 'manager_id');
    }

    /**
     * Get the orders created by this cashier.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'cashier_id');
    }

    /**
     * Get the notifications for this user.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
