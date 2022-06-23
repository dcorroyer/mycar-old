<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Validator\Constraints as SecurityAssert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity("email", message: "A user with this email address already exists")]
#[ApiResource(
    collectionOperations: [
        'GET' => ['security' => 'is_granted("ROLE_ADMIN")'],
        'POST'
    ],
    itemOperations: [
        'DELETE',
        'GET' => [
            'normalization_context' => ['groups' => ['read:user:item']]
        ],
        'PUT'
    ],
    subresourceOperations: [
        'vehicules_get_subresource' => [
            'method' => 'GET',
            'path'   => '/users/{id}/vehicules'
        ]
    ],
    denormalizationContext: ['groups' => ['write:user:item']],
    normalizationContext: ['groups' => ['read:user:collection']],
    order: ['lastname' => 'ASC'],
    paginationItemsPerPage: 10
)]
#[ApiFilter(
    SearchFilter::class, properties: [
        'lastname'  => 'partial',
        'firstname' => 'partial',
        'email'     => 'partial'
    ]
)]
#[ApiFilter(
    OrderFilter::class, properties: [
        'lastname',
        'firstname'
    ]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:user:item', 'read:user:collection'])]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['write:user:item', 'read:user:item', 'read:user:collection'])]
    #[
        Assert\NotBlank(),
        Assert\Length(min: 2, max: 100)
    ]
    private ?string $lastname;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['write:user:item', 'read:user:item', 'read:user:collection'])]
    #[
        Assert\NotBlank(),
        Assert\Length(min: 2, max: 100)
    ]
    private ?string $firstname;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['write:user:item', 'read:user:item', 'read:user:collection'])]
    #[
        Assert\NotBlank(),
        Assert\Length(max: 255),
        Assert\Email()
    ]
    private ?string $email;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['write:user:item'])]
    #[
        Assert\NotBlank(),
        Assert\Length(max: 255),
        SecurityAssert\UserPassword()
    ]
    private ?string $password;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:user:item'])]
    #[
        Assert\NotBlank(),
        Assert\Date()
    ]
    private ?DateTime $createdAt;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Vehicule::class)]
    #[Groups(['read:user:item', 'read:user:collection'])]
    #[ApiSubresource()]
    private Collection $vehicules;

    public function __construct()
    {
        $this->vehicules = new ArrayCollection();
        $this->createdAt = new DateTime();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    /**
     * @param string $lastname
     * @return $this
     */
    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    /**
     * @param string $firstname
     * @return $this
     */
    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     * @return $this
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     * @return string|null
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * @param string $password
     * @return $this
     */
    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return DateTime|null
     */
    public function getCreatedAt(): ?DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param DateTime $createdAt
     * @return $this
     */
    public function setCreatedAt(DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return Collection<int, Vehicule>
     */
    public function getVehicules(): Collection
    {
        return $this->vehicules;
    }

    /**
     * @param Vehicule $vehicule
     * @return $this
     */
    public function addVehicule(Vehicule $vehicule): self
    {
        if (!$this->vehicules->contains($vehicule)) {
            $this->vehicules[] = $vehicule;
            $vehicule->setUser($this);
        }

        return $this;
    }

    /**
     * @param Vehicule $vehicule
     * @return $this
     */
    public function removeVehicule(Vehicule $vehicule): self
    {
        if ($this->vehicules->removeElement($vehicule)) {
            // set the owning side to null (unless already changed)
            if ($vehicule->getUser() === $this) {
                $vehicule->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return string
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }
}
